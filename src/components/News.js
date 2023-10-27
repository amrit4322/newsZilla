import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0

    };
    document.title = `${this.capitalise(this.props.category)} - NewsZilla`;
  }
   capitalise=(string)=>{
  return string.charAt(0).toUpperCase()+string.slice(1);
 }
  async updateNews() {
   
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
      
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
   
    this.updateNews();
  }

  // handlePrevClick = async () => {
  //   this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // };

  // handleNextClick = async () => {
  //   this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // };

  fetchMoreData = async() => {
    
   
   
   const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
   
  
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      page:this.state.page+1
      
    });
   
  };

  render() {
    return (
      <>
        <h1 className="text-center " style={{marginBottom:"30px",marginTop:"90px"}}>NewsZilla - Top  {this.capitalise(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner></Spinner>}
         <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length<this.state.totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
        <div className="row">

          {this.state.articles.map((elem) => {
              return (
                <div className="col-md-3" key={elem.url}>
                  <NewsItem
                    title={elem.title ? elem.title : ""}
                    description={elem.description ? elem.description : ""}
                    imageUrl={
                      elem.urlToImage
                        ? elem.urlToImage
                        : "https://i.dailymail.co.uk/1s/2023/07/29/11/73747453-0-image-a-13_1690627619938.jpg"
                    }
                    newsUrl={elem.url}
                    author={elem.author}
                    date={elem.publishedAt}
                    source={elem.source.name}
                  />
                </div>
                
              );
            })}
        </div>
        </div>
        </InfiniteScroll>
        
        {/* <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            class="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            {" "}
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            class="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div> */}
      </>
    );
  }
}

export default News;
