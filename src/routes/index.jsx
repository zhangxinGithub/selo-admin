import { createFileRoute } from "@tanstack/react-router";
import { astro } from "iztro";

export const Route = createFileRoute("/")({
	component: Index,
});
const astrolabe = astro.bySolar("2014-05-22", 6, "女");
//递归删除astrolabe中是方法的属性
for (const key of Object.keys(astrolabe)) {
	if (typeof astrolabe[key] === "function") {
		delete astrolabe[key];
	}
}
//删除 astrolabe中
console.log("星盘", astrolabe);
// console.log("运限", astrolabe.horoscope(new Date()));
function Index() {
	return <>123</>;
}
