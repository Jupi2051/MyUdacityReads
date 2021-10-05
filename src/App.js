import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookComponent from './BookComponent';

class BooksApp extends Component
{
  state = {
    Books: [],
    query: "",
    QueryResult: [],
  }

  DoesBookExistInList(Book, ParentRef)
  {
    if (ParentRef.state.Books.some(x => x.id === Book.id))
      return ParentRef.state.Books.find((x) => x.id === Book.id)
    return false;
  }

  SetShelf(book, newShelf, ParentRef)
  {
    if (this.DoesBookExistInList(book, ParentRef)) // if the book is added
    {
      ParentRef.setState((prevState) => 
        {
          return {Books: prevState.Books.map((x) =>  
            {
              if (x.id === book.id)
              {
                x.shelf = newShelf;
                BooksAPI.update(book, newShelf); // updated through the API
              }
              return x;
            } )};
        })
      }
      else
      {
        ParentRef.setState((prevState) =>
        {
          book.shelf = newShelf;
          prevState.Books.push(book)
          return {Books: prevState.Books};
        });
      }
  }

  OnMoveBook(Book, args, ParentRef)
  {
    if (args.target.value !== "none")
    {
      ParentRef.SetShelf(Book, args.target.value, ParentRef)
    }
    else
    {
      if (ParentRef.DoesBookExistInList(Book, ParentRef))
      {
        ParentRef.setState(prevState =>(
          {
            Books: prevState.Books.filter((x => x.id !== Book.id))
          }
        ));
      }
    }
  }

  async componentDidMount()
  {
    await BooksAPI.getAll().then(x => {
      this.setState({Books: x});
    });
  }

  async UpdateQueryCollection(ParentRef, TextQuery)
  {
    let SearchResult = {}
    if(TextQuery !== "")
      SearchResult = await BooksAPI.search(TextQuery);
    ParentRef.setState({QueryResult: SearchResult, query: TextQuery});
  }

  render()
  {
    let CurrentlyReading = this.state.Books.filter(x => (x.shelf === "currentlyReading")).map((x) =>
    {
      return <BookComponent key={x.id} Book={x} OnChangeHandler={this.OnMoveBook} ParentRef={this}/>;
    });

    let WantToRead = this.state.Books.filter(x => (x.shelf === "wantToRead")).map((x) =>
    {
      return <BookComponent key={x.id} Book={x} OnChangeHandler={this.OnMoveBook} ParentRef={this}/>;
    });

    let read = this.state.Books.filter(x => (x.shelf === "read")).map((x) =>
    {
      return <BookComponent key={x.id} Book={x} OnChangeHandler={this.OnMoveBook} ParentRef={this}/>;
    });

    return (
      <div className="app">
        <Route exact path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/"><button className="close-search">Close</button></Link>
              
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author" onChange={(arg) => this.UpdateQueryCollection(this, arg.target.value)}/>
              </div>
            </div>
            {
              this.state.query === ""?
              <div className="no-results">
                <p>No Results</p>
              </div>
            :
              <div className="search-books-results">
                <ol className="books-grid">
                  {
                    (               
                      this.state.QueryResult.error === "empty query"?
                      <div className="no-results">
                        <p>No Results</p>
                      </div>
                      :
                      this.state.QueryResult.map((searchedbook) => 
                      {
                        let AlreadyExistingBook = this.DoesBookExistInList(searchedbook, this);
                        searchedbook.shelf = AlreadyExistingBook !== false? AlreadyExistingBook.shelf : "none";
                        return <BookComponent key={searchedbook.id} Book={searchedbook} OnChangeHandler={this.OnMoveBook} ParentRef={this}/>
                      })
                    )
                  }
                </ol>
              </div>
            }
          </div>
        )}/>

        <Route exact path="/" render={() =>(
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {CurrentlyReading}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {WantToRead}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {read}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search"><button>Add a book</button></Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
