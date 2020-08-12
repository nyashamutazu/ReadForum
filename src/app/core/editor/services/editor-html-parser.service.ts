import { Injectable } from '@angular/core';
import { EditorNode, EditorType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EditorHtmlParserService {

  private p = document.createElement('p');
  public parse(html: string): EditorNode {
    const div = document.createElement('div');
    div.innerHTML = html;
    return this.parseElement(div);
  }

  public parseElement(element: HTMLElement): EditorNode {
    const nodes = this.parseType(element);
    let currentNode = nodes[0];

    let isABlock = currentNode.type === EditorType.PARAGRAPH;
    for (let i = 1; i < nodes.length; i++) {
      currentNode.children.push(nodes[i]);
      currentNode = nodes[i];
      if (currentNode.type === EditorType.PARAGRAPH) {
        isABlock = true;
      }
    }

    let previousNodeWasText = false;
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      // pick ahead to look for <br>
      if (
        i < element.childNodes.length - 1 &&
        this.isLinebreak(element.childNodes[i + 1]) &&
        !(isABlock && i === element.childNodes.length - 2) // The last child is a BR in a block, this can be ignored
      ) {
        previousNodeWasText = false;
        if (child instanceof Text) {
          // wrap the text in a paragraph
          const paragraph = new EditorNode(EditorType.PARAGRAPH);
          paragraph.children.push(child.data);
          currentNode.children.push(paragraph);
        } else if (child instanceof HTMLElement) {
          // insert an empty paragraph
          currentNode.children.push(this.parseElement(child));
          currentNode.children.push(new EditorNode(EditorType.PARAGRAPH));
        } else {
          // ignore
        }
      } else {
        if (child instanceof Text) {
          // If two "pure" text node follow one another we can safely merge then as one (for i > 0)
          if (previousNodeWasText) {
            currentNode.children[currentNode.children.length - 1] =
              currentNode.children[currentNode.children.length - 1] +
              child.data;
          } else {
            currentNode.children.push(child.data);
          }
          previousNodeWasText = true;
        } else if (child instanceof HTMLElement) {
          currentNode.children.push(this.parseElement(child));
          previousNodeWasText = false;
        } else {
          // ignore
        }
      }
    }
    return nodes[0];
  }

  public findParentNodes(node: Node, until: Node): Array<EditorNode> {
    const nodes: Array<EditorNode> = [];
    let current: HTMLElement | Node =
      node.nodeType === 1
        ? (node as HTMLElement)
        : node.parentElement || node.parentNode;
    while (current !== until) {
      if (current instanceof HTMLElement) {
        nodes.push(...this.parseType(current));
      }
      current = current.parentElement || node.parentNode;
    }
    return nodes;
  }

  protected getAdditonalStyle(element: HTMLElement): Array<EditorNode> {
    const style = element.style;
    const detectedStyleNode = [];
    // Look for alignement
    const align = element.getAttribute('align') || style.textAlign;
    switch (align) {
      case 'left':
        detectedStyleNode.push(new EditorNode(EditorType.ALIGN_LEFT));
        break;
      case 'center':
        detectedStyleNode.push(new EditorNode(EditorType.ALIGN_CENTER));
        break;
      case 'right':
        detectedStyleNode.push(new EditorNode(EditorType.ALIGN_RIGHT));
        break;
      case 'justify':
        detectedStyleNode.push(new EditorNode(EditorType.JUSTIFY));
        break;
    }
    // Look for color
    const color = element.getAttribute('color') || style.color;
    if (color) {
      detectedStyleNode.push(new EditorNode(EditorType.COLOR, color));
    }
    // Look for size
    const size = element.getAttribute('size') || style.fontSize;
    if (size) {
      detectedStyleNode.push(new EditorNode(EditorType.SIZE, size));
    }
    // Look for family
    const typeface = element.getAttribute('face') || style.fontFamily;
    if (typeface) {
      detectedStyleNode.push(new EditorNode(EditorType.TYPEFACE, typeface));
    }

    return detectedStyleNode;
  }

  protected parseType(element: HTMLElement): Array<EditorNode> {
    const additionaStyle = this.getAdditonalStyle(element);
    switch (element.nodeName) {
      case 'H1':
        return [new EditorNode(EditorType.HEADER1), ...additionaStyle];
      case 'H2':
        return [new EditorNode(EditorType.HEADER2), ...additionaStyle];
      case 'H3':
        return [new EditorNode(EditorType.HEADER3), ...additionaStyle];
      case 'H4':
        return [new EditorNode(EditorType.HEADER4), ...additionaStyle];
      case 'H5':
        return [new EditorNode(EditorType.HEADER5), ...additionaStyle];
      case 'H6':
        return [new EditorNode(EditorType.HEADER6), ...additionaStyle];
      case 'B':
      case 'STRONG':
        return [new EditorNode(EditorType.BOLD)];
      case 'I':
      case 'EM':
        return [new EditorNode(EditorType.ITALIC)];
      case 'U':
        return [new EditorNode(EditorType.UNDERLINE)];
      case 'STRIKE':
        return [new EditorNode(EditorType.STRIKETHROUGH)];
      case 'SUB':
        return [new EditorNode(EditorType.SUBSCRIPT)];
      case 'SUP':
        return [new EditorNode(EditorType.SUPERSCRIPT)];
      case 'A':
        return [new EditorNode(EditorType.LINK, element.getAttribute('href'))];
      case 'OL':
        return [new EditorNode(EditorType.ORDERED_LIST)];
      case 'UL':
        return [new EditorNode(EditorType.UNORDERED_LIST)];
      case 'LI':
        return [new EditorNode(EditorType.LISTITEM)];
      case 'DIV':
      case 'P':
        if (additionaStyle.length > 0) {
          return [...additionaStyle];
        }
        return [new EditorNode(EditorType.PARAGRAPH)];
      case 'BLOCKQUOTE':
        // FIXME: this doesn't work on FF
        if (element.style.marginLeft === '40px') {
          return [new EditorNode(EditorType.INDENT)];
        }
        return [new EditorNode(EditorType.NONE)];
      default:
        if (additionaStyle.length > 0) {
          return [...additionaStyle];
        }
        return [new EditorNode(EditorType.NONE)];
    }
  }

  protected parseValue(element: HTMLElement): any {
    switch (element.nodeName) {
      case 'A':
        return element.getAttribute('href');
    }
    return undefined;
  }

  protected serializeType(node: EditorNode): string {
    switch (node.type) {
      case EditorType.PARAGRAPH:
        return '<div>' + this.serialize(node, true) + '</div>';
      case EditorType.HEADER1:
        return '<h1>' + this.serialize(node, true) + '</h1>';
      case EditorType.HEADER2:
        return '<h2>' + this.serialize(node, true) + '</h2>';
      case EditorType.HEADER3:
        return '<h3>' + this.serialize(node, true) + '</h3>';
      case EditorType.HEADER4:
        return '<h4>' + this.serialize(node, true) + '</h4>';
      case EditorType.HEADER5:
        return '<h5>' + this.serialize(node, true) + '</h5>';
      case EditorType.HEADER6:
        return '<h6>' + this.serialize(node, true) + '</h6>';
      case EditorType.QUOTE:
        return '<quote>' + this.serialize(node) + '</quote>';
      case EditorType.CODE:
        return '<code>' + this.serialize(node) + '</code>';
      case EditorType.BOLD:
        return '<strong>' + this.serialize(node) + '</strong>';
      case EditorType.ITALIC:
        return '<em>' + this.serialize(node) + '</em>';
      case EditorType.UNDERLINE:
        return '<u>' + this.serialize(node) + '</u>';
      case EditorType.STRIKETHROUGH:
        return '<strike>' + this.serialize(node) + '</strike>';
      case EditorType.SUBSCRIPT:
        return '<sub>' + this.serialize(node) + '</sub>';
      case EditorType.SUPERSCRIPT:
        return '<sup>' + this.serialize(node) + '</sup>';
      case EditorType.LINK:
        return '<a href="' + node.value + '">' + this.serialize(node) + '</a>';
      case EditorType.ORDERED_LIST:
        return '<ol>' + this.serialize(node) + '</ol>';
      case EditorType.UNORDERED_LIST:
        return '<ul>' + this.serialize(node) + '</ul>';
      case EditorType.LISTITEM:
        return '<li>' + this.serialize(node) + '</li>';
      case EditorType.ALIGN_LEFT:
        return (
          '<div style="text-align: left;">' +
          this.serialize(node, true) +
          '</div>'
        );
      case EditorType.ALIGN_CENTER:
        return (
          '<div style="text-align: center;">' +
          this.serialize(node, true) +
          '</div>'
        );
      case EditorType.ALIGN_RIGHT:
        return (
          '<div style="text-align: right">' +
          this.serialize(node, true) +
          '</div>'
        );
      case EditorType.JUSTIFY:
        return (
          '<div style="text-align: justify;">' +
          this.serialize(node, true) +
          '</div>'
        );
      case EditorType.INDENT:
        return (
          '<blockquote style="margin-left: 40px">' +
          this.serialize(node, true) +
          '</blockquote>'
        );
      case EditorType.COLOR:
        return (
          '<font color="' + node.value + '">' + this.serialize(node) + '</font>'
        );
      case EditorType.SIZE:
        return (
          '<font size="' + node.value + '">' + this.serialize(node) + '</font>'
        );
      case EditorType.TYPEFACE:
        return (
          '<font face="' + node.value + '">' + this.serialize(node) + '</font>'
        );
      case EditorType.NONE:
        return this.serialize(node);
    }
  }

  protected isLinebreak(child: Node): boolean {
    return child instanceof HTMLElement && child.nodeName === 'BR';
  }
  protected encodeHtml(text: string) {
    // From https://stackoverflow.com/a/29482788/829139
    this.p.textContent = text;
    return this.p.innerHTML;
  }

  // Saves a Tree in string representation
  public serialize(node: EditorNode, fallbackToBr: boolean = false): string {
    let serialized = '';
    node.children.forEach(child => {
      if (typeof child === 'string') {
        serialized += this.encodeHtml(child);
      } else {
        serialized += this.serializeType(child);
      }
    });
    if (fallbackToBr && !serialized) {
      serialized = '<br>';
    }
    return serialized;
  }
}
