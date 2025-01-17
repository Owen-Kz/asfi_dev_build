const imageInput = document.getElementById('files');
        const imagePreview = document.getElementById('image-preview');

        // Handle image previews
        imageInput.addEventListener('change', () => {
            // imagePreview.innerHTML = ''; // Clear existing previews
            const files = Array.from(imageInput.files).slice(0, 5); // Limit to 5 files

            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';

              
                    let img 
                    if(file.type.slice(0,5) === 'image'){

                    img = document.createElement('img');
                    img.src = reader.result;
                    img.alt = file.name
                    }else{
                    img = document.createElement("div")
                    img.setAttribute("class", "fileAttachment")
                    img.innerHTML = `<b>${file.name}</b>`
                    }

                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-btn';
                    removeBtn.textContent = '×';
                    removeBtn.addEventListener('click', () => {
                        imageContainer.remove();
                        const dt = new DataTransfer();
                        const remainingFiles = Array.from(imageInput.files).filter((_, i) => i !== index);
                        remainingFiles.forEach(file => dt.items.add(file));
                        imageInput.files = dt.files;
                    });

                    imageContainer.appendChild(img);
                    imageContainer.appendChild(removeBtn);
                    imagePreview.appendChild(imageContainer);
                };
                reader.readAsDataURL(file);
            });
        });