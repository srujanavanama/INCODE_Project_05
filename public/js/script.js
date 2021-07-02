const image_url = 'https://image.tmdb.org/t/p/w500'

// Fetching the list of genres and using the name and id for the dropdown
$.getJSON(`/api/genre-list`)
.then((data) => {
    data.genres.forEach(genre => {
        const genreName = genre.name;
        const genreId = genre.id;
        const genreOption = $("<option>").append(`${genreName}`).attr("value", genreId)
        $("#genreList").append(genreOption);
    })
})
.catch(err => {
    console.log(err.responseJSON.status_message)
    $("#genreList").append("<div>Could not retrieve genres</div>")
})

// Fetching the list of popular movies
$.getJSON(`/api/popular-movies`)
.then(data => appendMovie(data.results))
.catch((err) => {
    console.log(err.responseJSON.status_message)
    $("#movies").append("<div>Could not retrieve movies</div>")
})

// When the dropdown for genre is selected, display the movies which belong to the selected genre
$("#genreList").change(() => {
    const genreId = $("#genreList").val()
    $.getJSON(`/api/genre-movies/${genreId}`)
    .then(data => {
        $("#movies").empty();
        appendMovie(data.results);
    })
    .catch((err) => {
        console.log(err.responseJSON.status_message)
        $("#movies").append("<div>Could not retrieve genre movies</div>")
    })
})

// input - list of movies
// output - appending those movies to the div with id movies
const appendMovie = moviesList => {
    moviesList.forEach(movie => {
        const posterImage = movie.poster_path
        const movieTitle = movie.original_title;
        const movieEntry = $("<div>").append(`<img src ="${image_url}${posterImage}" alt = ${movieTitle}>`)
        const titleDiv = $("<div>").append(`${movieTitle}`);
        movieEntry.append(titleDiv);
        $("#movies").append(movieEntry)
    })
}