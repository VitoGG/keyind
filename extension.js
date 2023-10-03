const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Gdk = imports.gi.Gdk;
const Gtk = imports.gi.Gtk;
const Clutter = imports.gi.Clutter;
const GObject = imports.gi.GObject;

const Panel = imports.ui.panel;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const MessageTray = imports.ui.messageTray;
const Config = imports.misc.config;

const POST_40 = parseFloat(Config.PACKAGE_VERSION) >= 40;
const POST_3_36 = parseFloat(Config.PACKAGE_VERSION) >= 3.36;
const Keymap = POST_3_36 ? Clutter.get_default_backend().get_default_seat().get_keymap() :
    Clutter.get_default_backend().get_keymap();
let panelButton;
let panelButtonText;
let keyMap;
let capsLockState = false;
let indicator;
let numlock_state;
let capslock_state;
let keychange;

let panelCaps;
let paenlNum;

function init() {
}

function addKeyInTab(label) {
    if(!panelButton) {
        panelButton = new St.Bin({
            style_class: "panel-button",
        });
        panelButtonText = new St.Label({
            text: label,
            y_align: Clutter.ActorAlign.CENTER,
        });
        panelButton.set_child(panelButtonText);
        addChildOnPanel();
    } else {
        panelButtonText.text = label;
    }
}


function addChildOnPanel() {
        Main.panel._rightBox.insert_child_at_index(panelButton, 0);
}

function whenCapsLockClicked(state) {
    let newCapsLockState = state;
    if (newCapsLockState !== capsLockState) {
        capsLockState = newCapsLockState;
        if (capsLockState) {
            addKeyInTab("Caps Lock ativado");
        } else {
            addKeyInTab("Caps Lock desativado");
        }
    }
}

function updateState() {
    numlock_state = Keymap.get_num_lock_state();
    capslock_state = Keymap.get_caps_lock_state();

    whenCapsLockClicked(capslock_state);
}

function enable() {
    keychange = Keymap.connect('state-changed', updateState);
}

function disable() {
    Keymap.disconnect(keychange);
    keychange = 0;
    Main.panel._rightBox.remove_child(panelButton);
}