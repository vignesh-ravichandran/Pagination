
$(document).ready(()=>{
    //initial fetch
    loaddata(1,"date_added DESC");
    //function to fetch data and generate paginated table
    function loaddata(page, sort){
     
       
        $.post("http://localhost:5000/projects",
  {
    page: page,
    sortby: sort
  },
  function(data, status){
   
   var html=[
    "<table class='table table-bordered'> ", 
    "<tr>",  
         "<th width='50%'>Project</th>",  
         "<th width='50%'>User</th>",  
         "<th width='50%'>Category</th>",
    "</tr>"  
   ];

   data.list.forEach((lineitem)=>{

    html.push('<tr>')  
    html.push(`<td>${lineitem.projecttitle}</td>`)  
    html.push(`<td>${lineitem.user}</td>`)
    html.push(`<td>${lineitem.category}</td>`)  
    html.push('</tr>')   

   });
   
   html.push(' </table>','<br />','<div align="center">','</div>');

   
   for(i=1;i<=data.pageno;i++){

       
   html.push( `<span class="pagination_link" style="cursor:pointer; padding:6px; border:1px solid #ccc;" id="${i}">`+i+"</span>");




   }
   html.push('</div>','<br />','<br />');


   html=html.join("\n");
  
   $('#pagination-content').html(html); 
    

  });


    }

  
let sortvalue='projecttitle';

 //even listner for changing sortby value
 $( "select" )
 .change(function() {
  
   let s=$( "#selector" ).val();
   
   sortvalue=s;
   loaddata(1,s);
 })
 .trigger( "change" );

  //event listener on pagelink
    $(document).on('click', '.pagination_link', function(){  
        var page = $(this).attr("id");  
        loaddata(page,sortvalue);  
   });  

  
 

});