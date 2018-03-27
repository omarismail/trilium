import noteDetailService from "./note_detail.js";
import utils from "./utils.js";
import treeChangesService from "./tree_changes.js";
import contextMenuService from "./context_menu.js";
import treeService from "./tree.js";
import editTreePrefixDialog from "../dialogs/edit_tree_prefix.js";

const keyBindings = {
    "del": node => {
        treeChangesService.deleteNodes(getSelectedNodes(true));
    },
    "ctrl+up": node => {
        const beforeNode = node.getPrevSibling();

        if (beforeNode !== null) {
            treeChangesService.moveBeforeNode([node], beforeNode);
        }

        return false;
    },
    "ctrl+down": node => {
        let afterNode = node.getNextSibling();
        if (afterNode !== null) {
            treeChangesService.moveAfterNode([node], afterNode);
        }

        return false;
    },
    "ctrl+left": node => {
        treeChangesService.moveNodeUpInHierarchy(node);

        return false;
    },
    "ctrl+right": node => {
        let toNode = node.getPrevSibling();

        if (toNode !== null) {
            treeChangesService.moveToNode([node], toNode);
        }

        return false;
    },
    "shift+up": node => {
        node.navigate($.ui.keyCode.UP, true).then(() => {
            const currentNode = getCurrentNode();

            if (currentNode.isSelected()) {
                node.setSelected(false);
            }

            currentNode.setSelected(true);
        });

        return false;
    },
    "shift+down": node => {
        node.navigate($.ui.keyCode.DOWN, true).then(() => {
            const currentNode = treeService.getCurrentNode();

            if (currentNode.isSelected()) {
                node.setSelected(false);
            }

            currentNode.setSelected(true);
        });

        return false;
    },
    "f2": node => {
        editTreePrefixDialog.showDialog(node);
    },
    "alt+-": node => {
        treeService.collapseTree(node);
    },
    "alt+s": node => {
        treeService.sortAlphabetically(node.data.noteId);

        return false;
    },
    "ctrl+a": node => {
        for (const child of node.getParent().getChildren()) {
            child.setSelected(true);
        }

        return false;
    },
    "ctrl+c": () => {
        contextMenuService.copy(treeService.getSelectedNodes());

        return false;
    },
    "ctrl+x": () => {
        contextMenuService.cut(treeService.getSelectedNodes());

        return false;
    },
    "ctrl+v": node => {
        contextMenuService.pasteInto(node);

        return false;
    },
    "return": node => {
        noteDetailService.focus();

        return false;
    },
    "backspace": node => {
        if (!utils.isTopLevelNode(node)) {
            node.getParent().setActive().then(treeService.clearSelectedNodes);
        }
    },
    // code below shouldn't be necessary normally, however there's some problem with interaction with context menu plugin
    // after opening context menu, standard shortcuts don't work, but they are detected here
    // so we essentially takeover the standard handling with our implementation.
    "left": node => {
        node.navigate($.ui.keyCode.LEFT, true).then(treeService.clearSelectedNodes);

        return false;
    },
    "right": node => {
        node.navigate($.ui.keyCode.RIGHT, true).then(treeService.clearSelectedNodes);

        return false;
    },
    "up": node => {
        node.navigate($.ui.keyCode.UP, true).then(treeService.clearSelectedNodes);

        return false;
    },
    "down": node => {
        node.navigate($.ui.keyCode.DOWN, true).then(treeService.clearSelectedNodes);

        return false;
    }
};

export default keyBindings;