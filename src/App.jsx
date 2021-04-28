import React from 'react';

import { Paper, IconButton, TextField } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AddIcon from '@material-ui/icons/Add';
import PublishIcon from '@material-ui/icons/Publish';

import './App.css';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { listSounds } from './graphql/queries';
import { updateSound, createSound } from './graphql/mutations';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import { v4 as uuid } from 'uuid';

Amplify.configure(awsconfig);

function App() {
    const [sounds, setSounds] = React.useState([]);
    const [soundPlaying, setSoundPlaying] = React.useState('');
    const [audioURL, setAudioURL] = React.useState('');
    const [showAddSound, setShowAddNewSound] = React.useState(false);

    React.useEffect(() => {
        fetchSounds();
    }, []);

    const toggleSound = async idx => {
        if (soundPlaying === idx) {
            setSoundPlaying('');
            return;
        }

        const soundFilePath = sounds[idx].filePath;
        try {
            const fileAccessURL = await Storage.get(soundFilePath, { expires: 300 });
            console.log('access url', fileAccessURL);
            setSoundPlaying(idx);
            setAudioURL(fileAccessURL);
            return;
        } catch (error) {
            console.log('error accessing file from S3', error);
            setAudioURL('');
            setSoundPlaying('');
        }
    }

    const fetchSounds = async () => {
        try {
            const soundsData = await API.graphql(graphqlOperation(listSounds));
            const soundsList = soundsData.data.listSounds.items;
            console.log('sounds list', soundsList);
            setSounds(soundsList);
        } catch (error) {
            console.log('error on fetching sounds', error);
        }
    };

    const addLike = async(idx) => {
        try {
            const sound = sounds[idx];
            sound.likes = sound.likes + 1;
            delete sound.createdAt;
            delete sound.updatedAt;

            const soundsData = await API.graphql(graphqlOperation(updateSound, { input: sound }));
            const soundsList = [...sounds];
            soundsList[idx] = soundsData.data.updateSound;
            setSounds(soundsList);
        } catch (error) {
            console.log('error on adding like to sound', error);
        }
    }

  return (
    <div className="App">
          <header className="App-header">
              <h2>Loops</h2>
              <p>A place to upload, share, and download free sound loops</p>
          <AmplifySignOut />
          </header>
          <div className="description">
              <p>*all audio files are in .wav format*</p>
          </div>

          <div className="soundsList">
              {sounds.map((sound, idx) => {
                  return (
                      <Paper variant="outlined" elevation={2} key={`sound${idx}`}>
                          <div className="soundsCard">
                              <IconButton aria-label="play" onClick={() => toggleSound(idx)}>
                                  {soundPlaying === idx ? <ExpandLessIcon /> : < PlayArrowIcon />}
                              </IconButton>
                              <div>
                                  <div className="soundTitle">{sound.title}</div>
                                  <div className="soundOwner">{sound.owner}</div>
                              </div>
                              <div>
                                  <IconButton aria-label="like" onClick={() => addLike(idx)}>
                                      <FavoriteIcon />
                                  </IconButton>
                                  {sound.likes}
                              </div>
                              <div className="soundDescription">{sound.description}</div>
                              <div className="soundDownload">Download</div>
                          </div>
                          {soundPlaying === idx ? (
                              <div className='AudioPlayer'>
                                  <AudioPlayer
                                      src={audioURL}
                                      loop
                                  />
                              </div>
                          ) : null}
                      </Paper>
                  )
              })}

              {showAddSound ? (
                  <AddSound onUpload={() => {
                      setShowAddNewSound(false)
                      fetchSounds()
                  }} />
              ) : <IconButton onClick={() => setShowAddNewSound(true)}> <AddIcon /></IconButton>
              }

          </div>

    </div>
  );
}

export default withAuthenticator(App);

const AddSound = ({ onUpload }) => {

    const [soundData, setSoundData] = React.useState({});
    const [wavData, setWavData] = React.useState();

    const uploadSound = async() => {
        console.log('soundData', soundData);

        const { title, owner, description } = soundData;

        const { key } = await Storage.put(`${uuid()}.wav`, wavData, { contentType: 'audio/wav' });

        const createSoundInput = {
            id: uuid(),
            title,
            owner,
            description,
            filePath: key,
            likes: 0
        }
        await API.graphql(graphqlOperation(createSound, { input: createSoundInput }));
        onUpload()
    };

    return (
        <div className="newSound">
            <TextField label="Title" value={soundData.title} onChange={e => setSoundData({ ...soundData, title: e.target.value })} />
            <TextField label="Creator" value={soundData.owner} onChange={e => setSoundData({ ...soundData, owner: e.target.value })} />
            <TextField label="Description" value={soundData.description} onChange={e => setSoundData({ ...soundData, description: e.target.value })} />
            <input type="file" accept="audio/wav" onChange={e => setWavData(e.target.files[0])}/>
            <IconButton onClick={uploadSound}>
                <PublishIcon />
            </IconButton>
        </div>
    );
}