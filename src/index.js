
import createObserver from "roamjs-components/dom/createObserver";

// store observers globally so they can be disconnected 
var runners = {
  menuItems: [],
  observers: [],
}

const FOOTNOTE_CREATOR_ID = 'footnote-creator';

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
const createIconButton = (icon) => {
  // create a button using a blueprintjs icon
  const popoverButton = document.createElement("button");
  popoverButton.className = "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
  popoverButton.tabIndex = 0;

  const popoverIcon = document.createElement("span");
  popoverIcon.className = `bp3-icon bp3-icon-${icon}`;

  popoverButton.appendChild(popoverIcon);

  return popoverButton;
};

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
