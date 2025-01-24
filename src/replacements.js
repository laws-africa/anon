import {rangeToTarget, targetToRange} from "@lawsafrica/indigo-akn/dist/ranges";

export class Replacement {
  constructor (oldText, newText, target) {
    this.oldText = oldText;
    this.newText = newText;
    this.target = target;
  }

  apply (root) {
    const range = this.toRange(root);
    if (range) {
      this.target = rangeToTarget(this.replaceWithText(range, this.newText), root);
    }
  }

  unapply (root) {
    const range = this.toRange(root);
    if (range) {
      this.target = rangeToTarget(this.replaceWithText(range, this.oldText), root);
    }
  }

  toRange (root) {
    return targetToRange(this.target, root);
  }

  replaceWithText(range, text) {
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);

    const newRange = document.createRange();
    newRange.setStartBefore(node);
    newRange.setEndAfter(node);

    return newRange;
  }

  /**
   * Find possible occurrences of this range in the root element, ignoring anything in <mark> tags
   * @param root Element
   * @returns array of Range objects
   */
  find (root) {
    let text = this.oldText;

    if (!RegExp.escape) {
      text = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    } else {
      text = RegExp.escape(text);
    }

    const regex = new RegExp('\\b' + text + '\\b', 'g');
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let matches = [];

    while (walker.nextNode()) {
      let node = walker.currentNode;
      let text = node.textContent;

      for (const match of [...text.matchAll(regex)]) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + this.oldText.length);
        matches.push(range);
      }
    }

    return matches;
  }
}
