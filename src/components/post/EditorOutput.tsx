import { FC } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

interface EditorOutputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  },
);

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: customCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      style={style}
      className="text-sm"
      renderers={renderers}
      data={content}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image src={src} alt="image" className="object-contain" fill />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function customCodeRenderer({ data }: any) {
  <pre className="bg-gray-800 rounded-md p-4">
    <code className="text-gray-100 text-sm font-mono">{data.code}</code>
  </pre>;
}

export default EditorOutput;
