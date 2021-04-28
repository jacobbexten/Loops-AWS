/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSound = /* GraphQL */ `
  query GetSound($id: ID!) {
    getSound(id: $id) {
      id
      title
      description
      filePath
      likes
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listSounds = /* GraphQL */ `
  query ListSounds(
    $filter: ModelSoundFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSounds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        filePath
        likes
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
