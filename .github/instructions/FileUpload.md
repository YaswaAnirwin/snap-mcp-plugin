# File Upload Components

## Overview
UUI provides a set of components to build a robust and user-friendly file upload experience. The two primary components are:
*   `DropSpot`: A container that acts as a dropzone for files. It handles file selection via drag-and-drop or a file dialog.
*   `FileCard`: A component used to display the status of a single uploaded file, including its name, size, upload progress, and actions like retrying or canceling.

These components are designed to be used together to create a complete file upload interface.

## API Reference

### `DropSpot`
The dropzone area for adding files.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `onFilesAdded` | `(files: File[]) => void` | - | **Required.** Callback function that is triggered when files are selected or dropped. It receives an array of `File` objects. |
| `render` | `(props: { isDragActive: boolean }) => React.ReactNode` | - | A render function for the content inside the dropzone. It receives an `isDragActive` prop to change the appearance when a user is dragging files over the area. |
| `infoText` | `string` | - | A text hint displayed below the main content. |
| `accept` | `string` | - | A comma-separated string of MIME types or file extensions to allow (e.g., `'image/png, .pdf'`). |
| `single` | `boolean` | `false` | If `true`, only a single file can be uploaded at a time. |
| `maxSize` | `number` | - | The maximum allowed file size in bytes. |
| `onUploadError` | `(error: IFileUploadError) => void` | - | Callback function for handling validation errors (e.g., file too large, wrong type). |
| `isDisabled` | `boolean` | `false` | If `true`, the dropzone is disabled. |

### `FileCard`
Displays the state of an individual file upload.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | `{ name: string, size: number }` | - | **Required.** An object containing the file's name and size. |
| `progress` | `number` | - | The upload progress, from 0 to 100. When provided, the card shows a progress bar. |
| `onCancel` | `() => void` | - | A callback to handle the cancellation of an upload. If provided, a cancel icon is displayed. |
| `onSuccess` | `() => void` | - | A callback for when the upload is successfully completed. |
| `onError` | `() => void` | - | A callback for when the upload fails. |
| `width` | `number \| '100%'` | `'100%'` | The width of the card. |

## Usage Examples

### Basic File Upload
This example shows a simple `DropSpot` that accepts files and lists their names.

```jsx
import React, { useState } from 'react';
import { DropSpot, Button, FlexRow, Text } from '@epam/uui';
import { ReactComponent as UploadIcon } from '@epam/assets/icons/common/action-upload-18.svg';

export default function BasicFileUploadExample() {
    const [files, setFiles] = useState<File[]>([]);

    const handleFilesAdded = (addedFiles: File[]) => {
        // Add new files to the existing list
        setFiles(currentFiles => [...currentFiles, ...addedFiles]);
    };

    return (
        <div>
            <DropSpot onFilesAdded={handleFilesAdded} />
            {files.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    <Text fontWeight="600">Selected Files:</Text>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}><Text>{file.name} ({Math.round(file.size / 1024)} KB)</Text></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
```

### Advanced Upload Manager
This example demonstrates a complete upload manager using both `DropSpot` and `FileCard` to show upload progress and handle success, error, and cancellation states.

```jsx
import React, { useState } from 'react';
import { DropSpot, FileCard, Panel, Text, Button } from '@epam/uui';
import { IFileUploadError } from '@epam/uui-core';

// Define a type for our file's state
interface UploadedFile {
    id: number;
    file: File;
    progress: number;
    status: 'uploading' | 'success' | 'error';
}

let fileIdCounter = 0;

// Mock upload function
const uploadFile = (file: UploadedFile, onProgress: (p: number) => void, onComplete: (status: 'success' | 'error') => void) => {
    let progress = 0;
    const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 20, 100);
        onProgress(progress);
        if (progress >= 100) {
            clearInterval(interval);
            // Simulate a random error for demonstration
            const didFail = Math.random() > 0.8;
            onComplete(didFail ? 'error' : 'success');
        }
    }, 300);
    return () => clearInterval(interval); // Return a cleanup function
};

export default function AdvancedFileUploadExample() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const updateFile = (id: number, updatedFields: Partial<UploadedFile>) => {
        setUploadedFiles(currentFiles =>
            currentFiles.map(f => (f.id === id ? { ...f, ...updatedFields } : f))
        );
    };

    const handleFilesAdded = (files: File[]) => {
        const newFiles: UploadedFile[] = files.map(file => ({
            id: fileIdCounter++,
            file,
            progress: 0,
            status: 'uploading',
        }));

        setUploadedFiles(current => [...current, ...newFiles]);

        newFiles.forEach(newFile => {
            uploadFile(
                newFile,
                (progress) => updateFile(newFile.id, { progress }),
                (status) => updateFile(newFile.id, { status })
            );
        });
    };

    const handleUploadError = (error: IFileUploadError) => {
        alert(`Upload Error: ${error.file.name} - ${error.errorType}`);
    };

    const removeFile = (id: number) => {
        setUploadedFiles(current => current.filter(f => f.id !== id));
    };

    return (
        <Panel shadow style={{ padding: '24px', width: '100%' }}>
            <DropSpot
                onFilesAdded={handleFilesAdded}
                onUploadError={handleUploadError}
                accept="image/png, image/jpeg"
                maxSize={10 * 1024 * 1024} // 10 MB
                infoText="Accepts PNG/JPEG files up to 10MB"
            />
            {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {uploadedFiles.map(uploadedFile => (
                        <FileCard
                            key={uploadedFile.id}
                            file={{ name: uploadedFile.file.name, size: uploadedFile.file.size }}
                            progress={uploadedFile.status === 'uploading' ? uploadedFile.progress : undefined}
                            onCancel={uploadedFile.status === 'uploading' ? () => removeFile(uploadedFile.id) : undefined}
                            onSuccess={uploadedFile.status === 'success' ? () => removeFile(uploadedFile.id) : undefined}
                            onError={uploadedFile.status === 'error' ? () => removeFile(uploadedFile.id) : undefined}
                        />
                    ))}
                </div>
            )}
        </Panel>
    );
}
```

## Best Practices
*   **Provide Clear Feedback:** Use the `infoText` prop on `DropSpot` to inform users about file constraints like allowed types and size limits. The `render` prop's `isDragActive` state can be used to change the dropzone's style to indicate it's ready to accept a drop.
*   **Handle Errors Gracefully:** Implement the `onUploadError` callback to catch validation errors before the upload process begins and inform the user with a clear message.
*   **Show Progress:** For any file that might take more than a second to upload, use the `FileCard` component with the `progress` prop to give the user feedback on the upload status. This improves the user experience significantly.
*   **Give Users Control:** Always provide a way for users to cancel an in-progress upload or remove a completed/failed file. The `onCancel`, `onSuccess`, and `onError` props on `FileCard` are designed for this purpose.