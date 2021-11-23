import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import { removeVideoNode } from "./removeVideoNode";
import { addParticipantNode } from "./addParticipantNode";
import { addScreenShareNode } from "./addScreenShareNode";
import { removeScreenShareNode } from "./removeScreenShareNode";
import { removeParticipantNode } from "./removeParticipantNode";

import { addVideoNode } from "./addVideoNode";
import { initUI } from "./ui.js";

const CONSUMER_KEY = "PpzQpRbuvzm5LNZrREIEpA==";
const CONSUMER_SECRET = "SvNZ57n-4iJdsONu_Rp-7_BQRS-vG-ZIKjgcy5HKAzk=";
alert("hi");
const avengersNames = [
  "Thor",
  "Cap",
  "Tony Stark",
  "Black Panther",
  "Black Widow",
  "Hulk",
  "Spider-Man",
];
let randomName =
  avengersNames[Math.floor(Math.random() * avengersNames.length)];

export const main = async () => {
  /* Event handlers */

  // When a stream is added to the conference
  VoxeetSDK.conference.on("streamAdded", (participant, stream) => {
    if (stream.type === "ScreenShare") {
      return addScreenShareNode(stream);
    }

    if (stream.getVideoTracks().length) {
      // Only add the video node if there is a video track
      addVideoNode(participant, stream);
    }

    // initUI().addParticipantNode(participant);
    // const addParticipantNode = (participant) => {
    //   // If the participant is the current session user, don't add them to the list
    //   if (participant.id === VoxeetSDK.session.participant.id) return;

    //   let participantNode = document.createElement('li');
    //   participantNode.setAttribute('id', 'participant-' + participant.id);
    //   participantNode.innerText = `${participant.info.name}`;

    //   const participantsList = document.getElementById('participants-list');
    //   participantsList.appendChild(participantNode);
    // };
    addParticipantNode(participant);
  });

  // When a stream is updated
  VoxeetSDK.conference.on("streamUpdated", (participant, stream) => {
    if (stream.type === "ScreenShare") return;

    if (stream.getVideoTracks().length) {
      // Only add the video node if there is a video track

      addVideoNode(participant, stream);
    } else {
      removeVideoNode(participant);
    }
  });

  // When a stream is removed from the conference
  VoxeetSDK.conference.on("streamRemoved", (participant, stream) => {
    if (stream.type === "ScreenShare") {
      return removeScreenShareNode();
    }

    removeVideoNode(participant);
    removeParticipantNode(participant);
  });

  try {
    // Initialize the Voxeet SDK
    // : It is best practice to use the VoxeetSDK.initializeToken function to initialize the SDK.
    // Please read the documentation at:
    // https://docs.dolby.io/communications-apis/docs/initializing-javascript
    VoxeetSDK.initialize(CONSUMER_KEY, CONSUMER_SECRET);

    // Open a session for the user
    await VoxeetSDK.session.open({ name: randomName });

    // Initialize the UI
    initUI(randomName);
  } catch (e) {
    alert("Something went wrong : " + e);
  }
};
