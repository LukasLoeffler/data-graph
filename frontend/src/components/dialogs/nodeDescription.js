
let descriptions = [
    {
        type: "logging",
        text: `
            Takes the input and logs the input to the console of the backend.
            In the future a log into the application console in the frontend is planned.
        `
    },
    {
        type: "button",
        text: `
            Triggers a <a href="/wiki/downstream">downstream</a> node by clicking on the blue <b>EXECUTE</b> button in the node.<br><br>
            The green bubble indicates the number of times the button has been pressed.
            This number can be resetted by right-clicking the blue button.
        `
    }
]


export function getDescription(nodeType) {
    let description = descriptions.find(descr => descr.type === nodeType);

    if (description) return description.text;
    else return "No description provided for node"
}