import React from 'react';
import Card from '../../components/Card/Card.component.tsx';
import CardForm from '../../components/CardForm/CardForm.component.tsx';

const Paycard = () => {
    return (
        <div className='paycard'>
            <Card />
            <CardForm />
        </div>
    );
}

export default Paycard;