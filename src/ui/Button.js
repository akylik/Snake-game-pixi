import { Container, Graphics, Text } from "pixi.js";
import { TextStyles } from "../TextStyles";

export class Button extends Container {
    constructor(title, event) {
        super();

        this.title = title;
        this.event = event;
        this.createButton();
        this.addAddeventListener();
    }

    hide() {
        this.alpha = 0;
    }

    show() {
        this.alpha = 1;
    }

    createButton() {
        const width = 100;
        const height = 40;
        const radius = 40;
        const buttonBg = new Graphics();
        const bgColor = 0xffa500;
        const borderColor = 0xb87333;
        buttonBg.beginFill(bgColor);
        buttonBg.lineStyle(2, borderColor);
        buttonBg.drawRoundedRect(
            -width * 0.5,
            -height * 0.5,
            width,
            height,
            radius
        );
        buttonBg.endFill();

        const btnText = new Text(this.title, TextStyles.main_style);
        btnText.anchor.set(0.5);

        this.addChild(buttonBg, btnText);
    }

    onClick(e) {
        e.stopPropagation();
        document.dispatchEvent(new Event(this.event));
    }

    addAddeventListener() {
        this.interactive = true;
        this.on("mousedown", (e) => this.onClick(e)).on(
            "touchstart",
            (e) => this.onClick(e)
        );
    }
}
