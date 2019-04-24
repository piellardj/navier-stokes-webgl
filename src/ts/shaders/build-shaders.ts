import Shader from "../gl-utils/shader";

function fetch(filepath: string): string {
  const request = new XMLHttpRequest();
  request.open('GET', filepath, false);
  request.send();
  return request.responseText;
}

interface Replace {
  toReplace: string;
  replacement: string;
};

class ShaderSrc {
  public vert: string;
  public frag: string;

  constructor(vert: string, frag: string) {
    this.vert = vert;
    this.frag = frag;
  }

  public batchReplace(includes: Replace[]): void {
    for (let include of includes) {
      this.vert = this.vert.replace(new RegExp(include.toReplace), include.replacement);
      this.frag = this.frag.replace(new RegExp(include.toReplace), include.replacement);
    }
  }

  static fromScript(vertId: string, fragId: string): ShaderSrc {
    const vert = (document.getElementById(vertId) as HTMLScriptElement).text;
    const frag = (document.getElementById(fragId) as HTMLScriptElement).text;
    return new ShaderSrc(vert, frag);
  }
}


export { fetch, Replace, ShaderSrc};