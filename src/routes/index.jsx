import { createFileRoute } from "@tanstack/react-router";
import { astro } from "iztro";

export const Route = createFileRoute("/")({
	component: Index,
});
const astrolabe = astro.bySolar("2014-05-22", 6, "女");
console.log("星盘", astrolabe);
console.log("运限", astrolabe.horoscope(new Date()));
function Index() {
	return <>123</>;
}
