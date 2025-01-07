// eslint-disable-next-line import/no-unresolved
import { Plugin } from 'da-y-wrapper';

function isURL(text) {
	try {
		// eslint-disable-next-line no-new
		new URL(text);
		return true;
	} catch (e) {
		return false;
	}
}

export default function linkConverter(schema) {
	return new Plugin({
		props: {
			handlePaste: (view, event, slice) => {
				// Check if the slice contains only text content
				let hasOnlyText = true;
				let hasContent = false;
				slice.content.forEach(block => {
					if (block.type !== schema.nodes.paragraph) {
						hasOnlyText = false;
					}
					block.content?.forEach(node => {
						hasContent = true;
						if (node.type !== schema.nodes.text) {
							hasOnlyText = false;
						}
					});
				});

				// If not text content or empty, let other handlers process it
				if (!hasOnlyText || !hasContent) {
					return false;
				}

				const { from } = view.state.selection;
				let tr = view.state.tr;
				let currentPosition = from;

				// Processing each block (paragraph) in the pasted content
				slice.content.forEach((block) => {
					// Create a new paragraph node for each block
					const paragraphNode = schema.nodes.paragraph.create();
					tr = tr.insert(currentPosition, paragraphNode);
					currentPosition += 2; // Move past paragraph opening

					const text = block.textContent;
					// Split by whitespace but preserve the whitespace
					const parts = text.split(/(\s+)/);

					parts.forEach(part => {
						if (part.length > 0) { // Only process non-empty parts
							if (part.trim() === '') {
								// Handle whitespace
								tr = tr.insert(currentPosition, schema.text(part));
								currentPosition += part.length;
							} else {
								// Insert the text
								tr = tr.insert(currentPosition, schema.text(part));

								// If it's a URL, add the link mark
								if (isURL(part)) {
									const linkMark = schema.marks.link.create({ href: part });
									tr = tr.addMark(currentPosition, currentPosition + part.length, linkMark);
								}

								currentPosition += part.length;
							}
						}
					});
				});

				// Set the selection to the end of the inserted content
				tr = tr.setSelection(view.state.selection.constructor.near(
					tr.doc.resolve(currentPosition)
				));

				view.dispatch(tr);
				return true;
			},
		},
	});
}
