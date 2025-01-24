import {rangeToTarget, targetToRange} from "@lawsafrica/indigo-akn/dist/ranges";

export class Replacement {
  constructor (oldText, newText, target) {
    this.oldText = oldText;
    this.newText = newText;
    this.target = target;
  }

  apply (root) {
    const range = targetToRange(this.target, root);
    if (range) {
      this.target = rangeToTarget(this.replaceWithText(range, this.newText), root);
    }
  }

  unapply (root) {
    const range = targetToRange(this.target, root);
    if (range) {
      this.target = rangeToTarget(this.replaceWithText(range, this.oldText), root);
    }
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
}
