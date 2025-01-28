import {rangeToTarget, targetToRange} from "@lawsafrica/indigo-akn/dist/ranges";
import { getTextNodes } from "@lawsafrica/indigo-akn/dist/ranges";

let counter = 0;

export class Replacement {
  constructor (root, oldText, newText, target, suggestion) {
    this.id = counter++;
    this.root = root;
    this.oldText = oldText;
    this.newText = newText;
    this.target = target;
    this.applied = false;
    this.suggestion = suggestion;
    this.marks = [];
  }

  apply () {
    if (!this.applied) {
      const range = this.toRange();
      if (range) {
        this.target = rangeToTarget(this.replaceWithText(range, this.newText), this.root);
        this.applied = true;
      }
    }
  }

  unapply () {
    if (this.applied) {
      const range = this.toRange();
      if (range) {
        this.target = rangeToTarget(this.replaceWithText(range, this.oldText), this.root);
        this.applied = false;
      }
    }
  }

  toRange () {
    return targetToRange(this.target, this.root);
  }

  replaceWithText(range, text) {
    const node = document.createTextNode(text);

    // insert the text at the start of the range, rather than deleting the contents and then inserting it, which
    // puts the text at the "end" which may be on a new line (i.e. past the end of the element)
    range.insertNode(node);
    range.setStartAfter(node);
    range.deleteContents();

    node.parentElement.normalize();

    const newRange = document.createRange();
    newRange.setStartBefore(node);
    newRange.setEndAfter(node);

    return newRange;
  }

  mark () {
    this.unmark();

    const range = this.toRange();

    for (const textNode of getTextNodes(range)) {
      if (textNode.parentElement) {
        let mark = textNode.ownerDocument.createElement('mark');
        textNode.parentElement.insertBefore(mark, textNode);
        mark.appendChild(textNode);
        mark.classList.toggle('applied', this.applied);
        mark._replacement = this;
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
    return this.oldText + " → " + this.newText;
  }
}

export class ReplacementGroup {
  constructor (replacements) {
    this.key = replacements[0].grouping();
    this.title = this.key;
    this.replacements = replacements;
    this.suggestions = [];
  }

  populateSuggestions () {
    // remove old suggestions, calling unmark() on them before doing so
    for (const replacement of this.suggestions) {
      replacement.unmark();
    }

    this.suggestions.splice(0, this.suggestions.length);

    if (this.replacements.length > 0) {
      const first = this.replacements[0];

      for (const range of this.findSuggestions(first.root, first.oldText)) {
        const replacement = new Replacement(
          first.root,
          range.toString(),
          first.newText,
          rangeToTarget(range, first.root),
          true,
        );
        this.suggestions.push(replacement);
      }
    }
  }

  /**
   * Find possible occurrences of this range in the root element, ignoring anything in <mark> tags
   * @returns array of Range objects
   */
  findSuggestions (root, oldText) {
    let text = oldText;

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

      // ignore text in marks
      if (node.parentElement.closest('mark')) {
        continue;
      }

      let text = node.textContent;

      for (const match of [...text.matchAll(regex)]) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + oldText.length);
        matches.push(range);
      }
    }

    return matches;
  }
}
