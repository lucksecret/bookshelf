
document.addEventListener('DOMContentLoaded', () => {

    let books;
    if (!localStorage.getItem('books'))
        localStorage.setItem('books', JSON.stringify([]));
    books = JSON.parse(localStorage.getItem('books'));

    const isDuplicateBook = title => {
        return books.some(book => book.title === title)
    }
    
    const createArticleBook = book => {
        const articleEl = document.createElement('article');
        articleEl.className = 'book_item';

        const titleEl = document.createElement('h3');
        titleEl.innerHTML = `Title : ${book.title}`;

        const authorParagraphEL = document.createElement('p');
        authorParagraphEL.innerHTML = `Auhor : ${book.author}`

        const yearParagraphEl = document.createElement('p');
        yearParagraphEl.innerHTML = `Year : ${book.year}`;

        const actionContainerEl = document.createElement('div');
        actionContainerEl.className = 'action';

        const deleteBtnEl = document.createElement('button');
        deleteBtnEl.innerHTML = "Hapus buku";
        deleteBtnEl.className = "red";
        deleteBtnEl.addEventListener('click', () => {deleteBook(book.id)})

        const updateBtnEl = document.createElement('button');
        updateBtnEl.innerHTML = "Edit buku";
        updateBtnEl.className = "blue";
        updateBtnEl.addEventListener('click', () => {updateInfoBook(book.id)})

        const completeBtnEl = document.createElement('button');
        completeBtnEl.addEventListener('click', () => {setToCompleteBook(book.id)});
        if (book.isComplete) {
            completeBtnEl.innerHTML = "Belum selesai dibaca";
            completeBtnEl.className = "yellow";
        } else {
            completeBtnEl.innerHTML = "Selesai dibaca";
            completeBtnEl.className = "green";
        }

        actionContainerEl.append(deleteBtnEl);
        actionContainerEl.append(updateBtnEl);
        actionContainerEl.append(completeBtnEl);

        articleEl.append(titleEl);
        articleEl.append(authorParagraphEL);
        articleEl.append(yearParagraphEl);
        articleEl.append(actionContainerEl);

        return articleEl;
    }

    const updateBookshelf = listOfBook => {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');

        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        listOfBook.forEach(book => {
            book.isComplete ?
                completeBookshelfList.append(createArticleBook(book))
            :
                incompleteBookshelfList.append(createArticleBook(book));
        });
    }

    const deleteBook = id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const index = books.findIndex(book => book.id === id);
                if (index !== -1) {
                    books.splice(index, 1);
                    localStorage.setItem('books', JSON.stringify(books));
                    updateBookshelf(books);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your book has been deleted.",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Book not found.",
                        icon: "error"
                    });
    
                }
            }
        });
    };

    const setToCompleteBook = id => {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete;
            localStorage.setItem('books', JSON.stringify(books));
            updateBookshelf(books);
        }
    }

    const updateInfoBook = (id) => {
        const index = books.findIndex(book => book.id === id);
      
        Swal.fire({
          title: `Update Book Information (ID: ${id})`,
          html: `
            <input id="swal-input-title" class="swal2-input" placeholder="Title" value="${books[index].title}">
            <input id="swal-input-author" class="swal2-input" placeholder="Author" value="${books[index].author}">
            <input id="swal-input-year" class="swal2-input" placeholder="Year" type="number" value="${books[index].year}">
          `,
          focusConfirm: false,
          preConfirm: () => {
            const newTitle = document.getElementById('swal-input-title').value;
            const newAuthor = document.getElementById('swal-input-author').value;
            const newYear = parseInt(document.getElementById('swal-input-year').value);
      
            if (!newTitle || !newAuthor || isNaN(newYear)) {
              Swal.showValidationMessage('Please fill in all fields correctly.');
              return; 
            }
      
            return { newTitle, newAuthor, newYear };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            books[index].title = result.value.newTitle;
            books[index].author = result.value.newAuthor;
            books[index].year = result.value.newYear;
      
            localStorage.setItem('books', JSON.stringify(books));
            updateBookshelf(books); 
      
            Swal.fire('Success!', 'Book information updated.', 'success');
          }
        });
      };

    const handleSearch = e => {
        e.preventDefault();

        const query = document.getElementById('searchBookTitle').value.toLowerCase().trim();

        const searchResults = books.filter(book =>  (
                book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query) || book.year.toString().includes(query)
          ));

        if (searchResults.lenght !== 0)
            updateBookshelf(searchResults);
    }

    document.getElementById('inputBook').addEventListener('submit', e => {
        e.preventDefault();
        
        const bookTitle = document.getElementById('inputBookTitle').value;
        const bookAuthor = document.getElementById('inputBookAuthor').value;
        const bookYear = document.getElementById('inputBookYear').value;
        const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

        if (isDuplicateBook(bookTitle))
            alert(`Buku dengan judul ${bookTitle} sudah ada dalam daftar.`);
        else {
            const book = {
                id : new Date().getTime(),
                title: bookTitle.toLowerCase(),
                author: bookAuthor.toLowerCase(),
                year: bookYear,
                isComplete: bookIsComplete
            };

            books.push(book);
            localStorage.setItem('books', JSON.stringify(books));

            updateBookshelf(books);
        }
        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;
    });

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', handleSearch);
    searchBook.addEventListener('keyup', e => {
        handleSearch(e);
    })

    updateBookshelf(books);
});