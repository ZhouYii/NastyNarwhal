function get(id) {
    return document.getElementById(id);
}

function rand_elem(arr) {
   return arr[Math.floor(Math.random()*arr.length)];
}

/* Pulled out of the original source code from CC */
function AddEvent(html_element, event_name, event_function) 
{
   if(html_element.attachEvent) //Internet Explorer
      html_element.attachEvent("on" + event_name, function() {event_function.call(html_element);}); 
   else if(html_element.addEventListener) //Firefox & company
      html_element.addEventListener(event_name, event_function, false);
}

