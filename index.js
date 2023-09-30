educationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

let countyData;
let educationData;

let canvas = d3.select("#canvas")
let tooltip = d3.select("#tooltip")

let drawMap = () =>{
    canvas.selectAll('path')
          .data(countyData)
          .enter()
          .append('path')
          .attr('d', d3.geoPath())
          .attr("class", "county")
          .attr('fill', (d) =>{
            let id = d['id']
            let county = educationData.find((item) =>{
                return item['fips'] === id; 
            })
            let percentage = county['bachelorsOrHigher']
            if(percentage <= 15){
                return 'lightgreen'
            }else if(percentage <= 30){
                return 'limegreen'
            }else if(percentage <= 45){
                return 'green'
            }else{
                return 'darkgreen'
            }
          })
          .attr('data-fips', (d) => d.id)
          .attr('data-education', (d) =>{
            let id = d['id']
            let county = educationData.find((item) =>{
                return item['fips'] === id; 
            })
            let percentage = county['bachelorsOrHigher']
            return percentage;
          })
          .on('mouseover', function(e, d){
            let id = d['id']
            let county = educationData.find((item) =>{
                return item['fips'] === id; 
            })

            d3.select("#tooltip")
              .attr("data-education", county['bachelorsOrHigher'])
              .style("opacity", 1)
              .style("left", (e.target.pageX) + "px")
              .style("top", (e.target.pageY) + "px")
              .style("background-color", "rgba(0, 0, 0, .7")
              .html("<p>"+"Code: " + county['fips'] + ",  Name: " + county['area_name']+ ",  State: " +county['state'] + ",  Education: "+county['bachelorsOrHigher'] + "%")
        })
        .on('mouseout', function(e, d){
            d3.select("#tooltip")
              .style("opacity", 0)
              .style("background-color", "none")
        })
    
}

d3.json(countyUrl).then(
    (data, error) =>{
        if(error){
            console.log(error);
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationUrl).then(
                (data, error) =>{
                    if(error){
                        console.log(error);
                    }else{
                        educationData = data
                        console.log(educationData);
                        drawMap()
                    }
                }
            )
        }
    })