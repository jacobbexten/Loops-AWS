/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSound = /* GraphQL */ `
  mutation CreateSound(
    $input: CreateSoundInput!
    $condition: ModelSoundConditionInput
  ) {
    createSound(input: $input, condition: $condition) {
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
export const updateSound = /* GraphQL */ `
  mutation UpdateSound(
    $input: UpdateSoundInput!
    $condition: ModelSoundConditionInput
  ) {
    updateSound(input: $input, condition: $condition) {
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
export const deleteSound = /* GraphQL */ `
  mutation DeleteSound(
    $input: DeleteSoundInput!
    $condition: ModelSoundConditionInput
  ) {
    deleteSound(input: $input, condition: $condition) {
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
