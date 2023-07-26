import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import $ from 'jquery';

const renderMultipleCarouseles = () => {
    $('.carousel-item div:not(:first-child)').remove();
    const items = $('.carousel-item');
    const slideItems = items.length <= 4 ? items.length : 4;

    items.each(el => {
        let next = items[el].nextElementSibling;
        for (let i = 1; i < slideItems; i++) {
            if(!next)   next = items[0];

            const cloneChild = next.cloneNode(true)
            items[el].append(cloneChild.childNodes[0])
            next = next.nextElementSibling
        }
    })
}


const Favorates = () : JSX.Element => {
    const carousel = [{name : 'User 1', img : process.env.PUBLIC_URL+'/logo192.png'},
    {name : 'User 2', img : process.env.PUBLIC_URL+'/guest.jpg'},
    {name : 'User 3', img : process.env.PUBLIC_URL+'/logo512.png'},
    {name : 'User 4', img : process.env.PUBLIC_URL+'/guest.jpg'},
    {name : 'User 5', img : process.env.PUBLIC_URL+'/logo512.png'},
    {name : 'User 6', img : process.env.PUBLIC_URL+'/guest.jpg'}];

    useEffect(() => {
        renderMultipleCarouseles();
    }, [ ])

    const [index, setIndex] = useState(0);

    return (
        <Carousel activeIndex={index} onSelect={setIndex} interval={3000}>
            { carousel.map((item,i) => 
            <Carousel.Item key={i} className="text-center">
                <div className="d-inline-block m-2">
                    <div className="position-relative">
                        <img height={100} width={100} src={item.img} alt="profile-fav" className="img rounded-circle" />
                        <i className="position-absolute end-0 top-0 bi-star-fill text-warning"/>
                    </div>
                    <h4>{item.name}</h4>
                </div>
            </Carousel.Item> )}
        </Carousel>
    )
}

export default Favorates;