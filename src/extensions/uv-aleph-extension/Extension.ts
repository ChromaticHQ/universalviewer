import { AlephCenterPanel } from "../../modules/uv-alephcenterpanel-module/AlephCenterPanel";
import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-avmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAlephExtension } from "./IAlephExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { AlephLeftPanel } from "../../modules/uv-alephleftpanel-module/AlephLeftPanel";

export class Extension extends BaseExtension implements IAlephExtension {

    $downloadDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: AlephCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: AlephLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;

    create(): void {
        super.create();

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (e: any, canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

    }

    createModules(): void {
        super.createModules();

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new HeaderPanel(this.shell.$headerPanel);
        } else {
            this.shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new AlephLeftPanel(this.shell.$leftPanel);
        } else {
            this.shell.$leftPanel.hide();
        }

        this.centerPanel = new AlephCenterPanel(this.shell.$centerPanel);

        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
        } else {
            this.shell.$rightPanel.hide();
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel(this.shell.$footerPanel);
            this.mobileFooterPanel = new MobileFooterPanel(this.shell.$mobileFooterPanel);
        } else {
            this.shell.$footerPanel.hide();
        }

        this.$shareDialogue = $('<div class="uv-overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$downloadDialogue = $('<div class="uv-overlay download" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$settingsDialogue = $('<div class="uv-overlay settings" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel.init();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel.init();
        }

        if (this.isRightPanelEnabled()) {
            this.rightPanel.init();
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel.init();
        }
    }

    dependencyLoaded(index: number, dep: any): void {
        // if (index === (<any>this).getDependencyIndex('ami')) {
        //     window.AMI = dep;
        // } else 
        if (index === (<any>this).getDependencyIndex('three.min')) {
            window.THREE = dep; //https://github.com/mrdoob/three.js/issues/9602
        }
    }

    render(): void {
        super.render();
    }

    isLeftPanelEnabled(): boolean {
        return Utils.Bools.getBool(this.data.config.options.leftPanelEnabled, true);
    }

    getEmbedScript(template: string, width: number, height: number): string {
        const appUri: string = this.getAppUri();
        const iframeSrc: string = `${appUri}#?manifest=${this.helper.iiifResourceUri}`;
        const script: string = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    }
}
