let select_month = document.getElementById('select_month');
let select_year = document.getElementById('select_year');
let btn_prev = document.getElementById('prev_month');
let btn_next = document.getElementById('next_month');
let btn_curr = document.getElementById('curr_month');
let calendar_dates = document.getElementById('dates');
let today = new Date();
let backgrounds = [
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
]

// set current month and year
select_year.value = today.getFullYear();
select_month.value = today.getMonth();
generateDates();

// eventlisteners
select_month.addEventListener("change", generateDates);
select_year.addEventListener("change", generateDates);
btn_prev.addEventListener("click", ()=>{switchMonth(-1)});
btn_next.addEventListener("click", ()=>{switchMonth(1)});
btn_curr.addEventListener("click", ()=>{switchMonth(0)});

// navigate months
function switchMonth(dir){
    if(dir == 0){
        select_year.value = today.getFullYear();
        select_month.value = today.getMonth();
    } else {
        let current_date = new Date(select_year.value, select_month.value, 1);
        let new_date = new Date(current_date.setMonth(current_date.getMonth()+dir));
        select_year.value = new_date.getFullYear();
        select_month.value = new_date.getMonth();
    }
    generateDates();
}

// generate dates
function generateDates(){
    calendar_dates.innerHTML = '';

    let month = select_month.value
    let year = select_year.value
    let first_day_month = new Date(year, month, 1).getDay();
    let total_days_month = new Date(year, month+1, 0).getDate();

    for(i=0; i<first_day_month;i++){
        calendar_dates.append(el('div',''));
    }
    for(i=0; i<total_days_month;i++){
        let cell = el('div',i+1);
        cell.classList.add('date');
        if(today.getMonth() == month && today.getFullYear() == year && today.getDate() == i+1){
            cell.classList.add('today');
        }
        calendar_dates.append(cell);
    }

    let rest_cells = 7 - (total_days_month + first_day_month) % 7;
    if(rest_cells < 7){
        for(i=0; i<7 - (total_days_month + first_day_month) % 7; i++){
            calendar_dates.append(el('div'));
        }
    }

    console.log(first_day_month, total_days_month);
}

function el(element, content=''){
    let el = document.createElement(element);
    el.innerHTML = content;
    return el;
}