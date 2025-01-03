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
                console.log(`Handling paste event with slice: ${slice}`);
                
                const { from } = view.state.selection;
                let tr = view.state.tr;
                let currentPosition = from;

                // Process each block (paragraph) in the pasted content
                slice.content.forEach((block) => {
                    // Create a new paragraph node for each block
                    const paragraphNode = schema.nodes.paragraph.create();
                    tr = tr.insert(currentPosition, paragraphNode);
                    currentPosition += 2; // Move past paragraph opening

                    const text = block.textContent;
                    // Split by whitespace but preserve the whitespace
                    const parts = text.split(/(\s+)/);
                    
                    parts.forEach(part => {
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
                    });
                });

                view.dispatch(tr);
                return true;
            },
        },
    });
}
