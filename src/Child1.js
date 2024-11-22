import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component 
{
  state = 
  { 
    company: "Apple", 
    selectedMonth: "November", 
  };

  // if anything changed 
  
  componentDidUpdate(prevProps, prevState) 
  {
    if (
      prevProps.csv_data !== this.props.csv_data || prevState.company !== this.state.company || prevState.selectedMonth !== this.state.selectedMonth) {
      this.renderChart();
    }
  }

  componentDidMount() 
  {
    this.renderChart();
  }


  // filtering and getting data 

  get_data () 
  {
   
    const { company, selectedMonth } = this.state;

    const { csv_data } = this.props;
   
    return csv_data.filter((d) => d.Company === company && d.Date.toLocaleString("default", { month: "long" }) === selectedMonth );
  }


  renderChart() 
  {
      // setting up the constrains for the graph 

      const data = this.get_data();
      const svgWidth = 700;
      const svgHeight = 500;
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  
      d3.select("#graph").selectAll("*").remove();
  
      const svg = d3
          .select("#graph")
          .append("svg")
          .attr("width", svgWidth)
          .attr("height", svgHeight);
  
      const xScale = d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d.Date))
          .range([margin.left, svgWidth - margin.right]);
  
      const yScale = d3
          .scaleLinear()
          .domain([
              d3.min(data, (d) => Math.min(d.Open, d.Close)),
              d3.max(data, (d) => Math.max(d.Open, d.Close)),
          ])
          .range([svgHeight - margin.bottom, margin.top]);
  
      // x and y axis 
      svg
          .append("g")
          .attr("transform", `translate(0,${svgHeight - margin.bottom})`)
          .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d")));
  
      svg
          .append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(yScale));
  
      // red and green lines 
      svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "green")
          .attr("stroke-width", 3)
          .attr(
              "d",d3
                  .line()
                  .x((d) => xScale(d.Date))
                  .y((d) => yScale(d.Open))
          );
  
      svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 3)
          .attr(
              "d",d3
                  .line()
                  .x((d) => xScale(d.Date))
                  .y((d) => yScale(d.Close))
          );
  
      // tooltips  
      svg
          .selectAll(".dot-open")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(d.Date))
          .attr("cy", (d) => yScale(d.Open))
          .attr("r", 4)
          .attr("fill", "green")
          .on("mouseover", (event, d) => 
          {
              d3.select("#circles")
                  .style("opacity", 1)
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY + 10}px`)
                  .html(
                      `Date: ${d.Date.toDateString()}<br>Open: $${d.Open}<br>Close: $${d.Close}<br>Difference: $${(
                          d.Close - d.Open
                      ).toFixed(2)}`
                  );
          })
          .on("mouseout", () => d3.select("#circles").style("opacity", 0));
  
      svg
          .selectAll(".dot-close")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(d.Date))
          .attr("cy", (d) => yScale(d.Close))
          .attr("r", 4)
          .attr("fill", "#e41a1c")
          .on("mouseover", (event, d) => 
          {
              d3.select("#circles")
                  .style("opacity", 1)
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY + 10}px`)
                  .html(
                      `Date: ${d.Date.toDateString()}<br>Open: $${d.Open}<br>Close: $${d.Close}<br>Difference: $${(
                          d.Close - d.Open
                      ).toFixed(2)}`
                  );
          })
          .on("mouseout", () => d3.select("#circles").style("opacity", 0));
  }
  

  render() 
{
  // rendering 
  const options = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta']; 
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // picking companies and months

    return (
        <div className="child1">

            <div>
                <h3>Company Name:</h3>
                {options.map((option) => (
                    <label key={option}>
                        <input
                            type="radio"
                            value={option}
                            checked={this.state.company === option}
                            onChange={() => this.setState({ company: option })}
                        />
                        {option}
                    </label>
                ))}
            </div>

            <div>
                <h3>SelectMonth:</h3>
                <select
                   
                   value={this.state.selectedMonth}
                    onChange={(e) => this.setState({ selectedMonth: e.target.value })}
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div id="graph"></div>

            <div id="circles" className="circles"></div>

        </div>
    );
}

}

export default Child1;