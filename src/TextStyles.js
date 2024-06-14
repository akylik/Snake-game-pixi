import { TextStyle } from "pixi.js";

export const TextStyles = {
    main_style: new TextStyle({
        align: "center",
        fill: ["#fdfdcf", "#fdfd14"],
        fontFamily: "Rowdies-Regular",
        fontSize: 25,
        lineJoin: "round",
        stroke: "#ffffff",
    }),
    selected_style: new TextStyle({
        align: "center",
        fill: ["#ff0000", "#ff4d4d"],
        fontFamily: "Rowdies-Regular",
        fontSize: 25,
        lineJoin: "round",
        stroke: "#ffffff",
        fontWeight: 'bold',
    }),
};
