import { redirect } from '@sveltejs/kit';

export const load = ({ params }) => {
	const slug = params.workspace;
	throw redirect(307, `/${slug}/dashboard`);
};
