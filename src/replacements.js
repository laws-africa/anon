import {rangeToTarget, targetToRange} from "@lawsafrica/indigo-akn/dist/ranges";
import { getTextNodes } from "@lawsafrica/indigo-akn/dist/ranges";

export class Replacement {
  constructor (oldText, newText, target) {
    this.oldText = oldText;
    this.newText = newText;
    this.target = target;
    this.applied = false;
    this.marks = [];
  }

  apply (root) {
    const range = this.toRange(root);
    if (range) {
      this.target = rangeToTarget(this.replaceWithText(range, this.newText), root);
      this.applied = true;
    }
  }

  unapply (root) {
    const range = this.toRange(root);
    if (range) {
      this.target = rangeToTarget(this.replaceWithText(range, this.oldText), root);
      this.applied = false;
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

  mark (contentRoot) {
    this.unmark(contentRoot);

    const range = this.toRange(contentRoot);

    for (const textNode of getTextNodes(range)) {
      if (textNode.parentElement) {
        let mark = textNode.ownerDocument.createElement('mark');
        textNode.parentElement.insertBefore(mark, textNode);
        mark.appendChild(textNode);
        this.marks.push(mark);
      }
    }
  }

  unmark () {
    for (const mark of this.marks) {
      const parent = mark.parentElement;
      while (parent && mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      mark.remove();
    }
    this.marks = [];
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

  snippet () {
    const sel = this.target.selectors.find((s) => s.type === 'TextQuoteSelector');
    const len = 15;

    if (sel) {
      return `... ${sel.prefix.slice(-len)}<mark>${sel.exact}</mark>${sel.suffix.slice(0, len)} ...`;
    } else {
      return this.oldtext;
    }
  }

  grouping () {
    return this.oldText + " -> " + this.newText;
  }
}

export class ReplacementGroup {
  constructor (replacements) {
    this.key = replacements[0].grouping();
    this.title = this.key;
    this.replacements = replacements;
  }
}
