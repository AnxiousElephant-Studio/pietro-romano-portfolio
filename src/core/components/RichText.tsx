const BLOCK_SEPARATOR = "\n\n";
const LIST_ITEM_PREFIX = "- ";
const LABEL_SEPARATOR = ": ";
const MAX_LABEL_LENGTH = 40;

type RichTextProps = { text: string };

function isListBlock(block: string) {
  return block.split("\n").every((line) => line.startsWith(LIST_ITEM_PREFIX));
}

function renderListItem(content: string) {
  const separatorIndex = content.indexOf(LABEL_SEPARATOR);

  if (separatorIndex <= 0 || separatorIndex > MAX_LABEL_LENGTH) {
    return content;
  }

  return (
    <>
      <strong>{content.slice(0, separatorIndex + 1)}</strong>
      {content.slice(separatorIndex + 1)}
    </>
  );
}

export default function RichText({ text }: RichTextProps) {
  return text.split(BLOCK_SEPARATOR).map((block) => {
    if (isListBlock(block)) {
      return (
        <ul key={block} className="rich-list">
          {block.split("\n").map((line) => (
            <li key={line}>{renderListItem(line.slice(LIST_ITEM_PREFIX.length))}</li>
          ))}
        </ul>
      );
    }

    return <p key={block}>{block}</p>;
  });
}
