from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import pickle
import requests

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)


# Load the movie data and similarity matrix
movies = pickle.load(open('movie_list.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Function to fetch the movie poster
def fetch_poster(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US"
    response = requests.get(url)
    data = response.json()
    poster_path = data.get('poster_path')
    if poster_path:
        return f"https://image.tmdb.org/t/p/w500/{poster_path}"
    return ""





# Function to get movie recommendations
def recommend(movie_title):
    try:
        # Find the index of the searched movie
        index = movies[movies['title'] == movie_title].index[0]
        
        # Get the movie_id details for the searched movie
        movie_id = int(movies[movies['title'] == movie_title]['movie_id'].iloc[0])
        
        searched_movie = {
            "id": movie_id,
            "title": movie_title,
            "poster_url": fetch_poster(movie_id)
        }

        # Calculate distances and get top 5 recommendations
        distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
        
        recommended_movies = []
        for i in distances[1:6]:  # Get top 5 recommendations
            movie_id = int(movies.iloc[i[0]].movie_id)  # Ensure it's an integer
            recommended_movies.append({
                "id": movie_id,
                "title": movies.iloc[i[0]].title,
                "poster_url": fetch_poster(movie_id)
            })

        # Include the searched movie at the start of the recommendations
        recommendations_with_search = [searched_movie] + recommended_movies
        
        print(f"Recommended movies: {recommendations_with_search}")  # Log recommendations
        return recommendations_with_search

    except IndexError:
        print("Movie not found or no recommendations available.")  # Log error
        return []



# API route for movie recommendations
@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    movie_title = data.get("movie_title")
    if not movie_title:
        return jsonify({"error": "No movie title provided"}), 400

    recommendations = recommend(movie_title)
    return jsonify(recommendations)



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5001)
