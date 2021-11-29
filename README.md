# library_case
Get books/{bookid} api parameter id should be google books id. For example https://www.googleapis.com/books/v1/volumes?q=horror for getting books you should use id value in json.
      "kind": "books#volume",
      "id": "AM3-DwAAQBAJ",
      "etag": "9ZZMKcDmpus",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/AM3-DwAAQBAJ",
      "volumeInfo": {
        "title": "The Book of Horror",
        "subtitle": "The Anatomy of Fear in Film",
        "authors": [
          "Matt Glasby"
        ]
According to this json you should enter {bookid} as AM3-DwAAQBAJ.     
For Get users/{userid} api , you should use  _id value.
   {
        "_id": "61a4c393bb57d6f1b428bdb4",
        "name": "Ozum",
        "__v": 0
    }
   According to this json you should enter {userid} as 61a4c393bb57d6f1b428bdb4. After user is created, you can see user _id value in get /users api response.   
        
