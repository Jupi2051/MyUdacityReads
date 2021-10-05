import React, { Component } from 'react';
import PropType from 'prop-types';

class BookComponent extends Component
{
    render()
    {
        return(
        <li>
            <div className="book">
              <div className="book-top">
                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${typeof this.props.Book.imageLinks == "undefined"? "N/A" : this.props.Book.imageLinks.thumbnail }")` }}></div>
                <div className="book-shelf-changer">
                  <select value={this.props.Book.shelf} onChange={(args) => this.props.OnChangeHandler(this.props.Book, args, this.props.ParentRef)}>
                    <option value="move" disabled>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <div className="book-title">{this.props.Book.title}</div>
              <div className="book-authors">{typeof this.props.Book.authors == "undefined"? "N/A" : this.props.Book.authors.join(", ")}</div>
            </div>
          </li>
        )
    }
}

BookComponent.propTypes = {
    OnChangeHandler: PropType.func.isRequired,
    Book: PropType.object.isRequired,
    ParentRef: PropType.object.isRequired,
};

export default BookComponent;