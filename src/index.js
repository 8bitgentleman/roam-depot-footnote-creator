
import createObserver from "roamjs-components/dom/createObserver";

// store observers globally so they can be disconnected 
var runners = {
  menuItems: [],
  observers: [],
}

const FOOTNOTE_CREATOR_ID = 'footnote-creator';
const superscript = ["⁰","¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const subscript = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

const panelConfig = {
  tabTitle: "Footnote Creator",
  settings: [
    
    {id:	 "select-setting",
     name:   "Select test",
     action: {type:	 "select",
          items:	["one", "two", "three"],
          onChange: (evt) => { console.log("Select Changed!", evt); }}}
  ]
};

function createFootnoteBlock(uid){
  //get the cursor position
  let cursorPos = document.querySelectorAll('textarea')[0].selectionStart
  let str = 'very cool ((more here)) after text'
  let bef = str.substring(0, cursorPos).split('((').pop()
  let aft = str.substring(cursorPos).split('))')[0]
  let block = bef + aft
  let uid = 'BLOCKUID'
  let blText = str.replace(`((${bef + aft}))`, `((${uid}))`)
  console.log(blText)
}

function createFootnoteButton(text){
  const footnote = document.createElement("div");
  footnote.className = "dont-unfocus-block";
  footnote.style = "border-radius: 2px; padding: 6px; cursor: pointer;";
  footnote.title = text;
  
  const markup = `
        <div class="rm-autocomplete-result">
            <span>${text}</span>
        </div>
        <div class="bp3-text-overflow-ellipsis">Create as footnote</div>
  `;
  
  footnote.innerHTML = markup
  return footnote
}

function onload({extensionAPI}) {

  let footnoteButton = createFootnoteButton("test");
  console.log(footnoteButton)
  // set defaults if they dont' exist

  extensionAPI.settings.panel.create(panelConfig);

  const autocompleteObserver = createObserver(() => {
    if (
        document.getElementsByClassName("rm-autocomplete__results") &&
        !document.getElementById(FOOTNOTE_CREATOR_ID)
    ) {
        const blockAutocomplete = document.getElementsByClassName("rm-autocomplete__results")[0];
        if (blockAutocomplete) {
          blockAutocomplete.insertAdjacentElement("afterbegin", footnoteButton);
          console.log("add autocomplete button")
        }
    }
    });
// save observers globally so they can be disconnected later
runners['observers'] = [autocompleteObserver]
console.log("load footnote creator plugin");
}

function onunload() {
  // loop through observers and disconnect
  for (let index = 0; index < runners['observers'].length; index++) {
    const element = runners['observers'][index];
    element.disconnect()
}
  console.log("unload footnote creator plugin");
}
  
export default {
onload,
onunload
};
