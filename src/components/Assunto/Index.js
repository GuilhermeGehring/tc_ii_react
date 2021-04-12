import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { List } from './List';
import { Form } from './Form';

function Assuntos() {
    const { pathname } = useHistory().location;
    
    return (
        <Switch>
            <Route exact path={pathname} component={List} />
            <Route path={`${pathname}/add`} component={Form} />
            <Route path={`${pathname}/edit/:id`} component={Form} />
        </Switch>
    );
}

export { Assuntos };