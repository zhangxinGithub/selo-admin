import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/code/code-detail")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/products/code-detail"!</div>;
}
