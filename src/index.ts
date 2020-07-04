import { comments as commentsData } from "./comments";

export type Comment = {
  id: string; // e.g. "CjkKGkNLbmlyZnJNcmVvQ0ZSWlU3UW9kNFJnT3pBEhtDTE9hX3ZUTXJlb0NGYVRFVEFJZFNVb01kUTA%3D"
  author: {
    name: string; // from authorName.simpleText e.g. "Uge Channel / 杏戸ゆげ 【ブイアパ】"
    id: string; // from authorExternalChannelId
  };
  messages: {
    type: "text" | "stamp";
    content: string;
  }[];
  time: {
    absMicros: string; // absolute UNIX timestamp ※microsec...?
    relMills: string; // relative time totoward video start. From videoOffsetTimeMsec
  };
};

type CElems = Record<string, Element | null>;
const cElems: CElems = {
  c1: document.querySelector("#c1"),
  c2: document.querySelector("#c2"),
  c3: document.querySelector("#c3"),
  c4: document.querySelector("#c4"),
  c5: document.querySelector("#c5"),
};

// flatten
const comments: Comment[] = [];
commentsData.forEach((cs) => comments.push(...cs));

//
const textnize = (comment: Comment) => {
  const msg = comment.messages.reduce(
    (total, chunk) => (total + chunk.type === "text" ? chunk.content : "□"),
    ""
  );
  return `${comment.author.name}: ${msg}`;
};

class CommentReserver {
  comments: Comment[];
  elemController: CommentElemController;
  // @ts-ignore
  reserves: Nodejs.Timeout[] = [];
  sections: Comment[][] = [];
  constructor(comments: Comment[], elemController: CommentElemController) {
    this.comments = comments;
    this.elemController = elemController;

    // 60sec sections
    const maxRelMin = Math.floor(
      parseInt(comments[comments.length - 1].time.relMills) / 1000 / 60
    );
    for (let i = 0; i <= maxRelMin; i++) {
      this.sections.push([]);
    }
    this.comments.forEach(
      ((comment: Comment) => {
        // rel 58 sec => [0], which is in [0sec, 60sec)
        const belongingRelMin = Math.floor(
          parseInt(comment.time.relMills) / 1000 / 60
        );
        this.sections[belongingRelMin].push(comment);
      }).bind(this)
    );
    console.log(this.sections);
  }
  reserve(relMin: number, futureOnly: boolean) {
    console.log("reserving");
    // comment display reservation
    // (relMin:0, futureOnly:false) => register [0sec, 60sec)
    // (relMin:1, futureOnly:true) & now 73sec => register (73sec, 120sec)
    const targets = this.sections[relMin];
    // @ts-ignore
    const currentRelSec: number = window.player.getCurrentTime();
    this.reserves.push(
      ...targets.map((comment) => {
        const deltaSec = parseInt(comment.time.relMills) / 1000 - currentRelSec;
        if (deltaSec < 0 && futureOnly === true) {
          console.log("future only");
          return undefined;
        } else {
          console.log(`delay: ${deltaSec * 1000}msec`);
          const timerID = setTimeout(
            (() => {
              console.log("elem update register");
              this.elemController.updateAnElem(textnize(comment));
            }).bind(this),
            deltaSec * 1000
          );
          return timerID;
        }
      })
    );
    // re-reservation
    const untilNextSec = (relMin + 1) * 60 - currentRelSec;
    const reReserveID = setTimeout(
      (() => {
        this.reserve(relMin + 1, false);
      }).bind(this),
      (untilNextSec - 3) * 1000 // 3sec safe offset
    );
    this.reserves.push(reReserveID);
  }
  clearReservation() {
    this.reserves.forEach((timerID) => clearTimeout(timerID));
    console.log("clear reservation");
  }
}

class CommentElemController {
  cElems: CElems;
  numElems: number;
  nextIndex = 0;
  constructor(cElems: CElems) {
    this.cElems = cElems;
    this.numElems = Object.keys(cElems).length;
  }
  updateAnElem(text: string) {
    // @ts-ignore
    this.cElems[`c${this.nextIndex + 1}`].textContent = text;
    this.nextIndex = (this.nextIndex + 1) % this.numElems;
  }
}

const commentElemController = new CommentElemController(cElems);
const commentReserver = new CommentReserver(
  comments,
  commentElemController,
  // @ts-ignore
  window.player
);

// @ts-ignore
window.commentElemController = commentElemController;
// @ts-ignore
window.commentReserver = commentReserver;
