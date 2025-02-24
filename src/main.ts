import { Notice, Plugin } from 'obsidian';
import { createCopyPlugin } from './copy-inline-code-view-plugin';


interface CopyInlineCodePluginSettings {
  showOnHover: boolean;
}

const DEFAULT_SETTINGS: Partial<CopyInlineCodePluginSettings> = {
  showOnHover: true,
};

export default class CopyInlineCodePlugin extends Plugin {
  settings: CopyInlineCodePluginSettings;

  async onload() {
    await this.loadSettings();
    this.copyInlineCodeLogic();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async copyInlineCodeLogic() {
    this.registerEditorExtension([createCopyPlugin(true)]);
		this.registerMarkdownPostProcessor((element, context) => {
			const inlineCodes = element.querySelectorAll("*:not(pre) > code");
			
			inlineCodes.forEach(code => {
				if(code.querySelector('span.copy-to-clipboard-icon')) {
					return
				}

				const icon = createSpan({cls: "copy-to-clipboard-icon", text: "\xa0📋"})
        icon.toggleClass("show-on-hover", true)
        const textToCopy = code.textContent

				icon.onclick = (event) => {			
					if(textToCopy) {
						event.stopPropagation();
						navigator.clipboard.writeText(textToCopy)
						new Notice(`Copied '${textToCopy}' to clipboard!`);
					}
				}
				
				code.appendChild(icon)
			})
		})
  }
}

