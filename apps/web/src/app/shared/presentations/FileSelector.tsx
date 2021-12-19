import { useFilePicker } from "use-file-picker";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

interface FileSelectorProps {
  title: string;
  extension: string;
  onFileLoaded: (file: File) => void;
}

function FileSelector({ onFileLoaded, title, extension }: FileSelectorProps) {
  const [openFileSelector, { plainFiles }] = useFilePicker({
    accept: extension
  });

  useEffect(() => {
    if (plainFiles?.length) {
      onFileLoaded(plainFiles[0]);
    }
  }, [plainFiles]);

  return (
    <Button variant="primary" size="sm" onClick={() => openFileSelector()}>{title}</Button>
  );
}

export default FileSelector;
