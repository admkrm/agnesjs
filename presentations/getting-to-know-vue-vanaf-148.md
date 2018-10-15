# Using components

## What Is a Component?

A component is a custom element that we can define and reuse. We will define our components as little instances of Vue, but instead of calling new Vue for a full instance of Vue, we have to register them where needed. So, each component will have its version of most things that a Vue instance has except for an el property. Most Vue applications end up being a collection of Vue components working together to display data and react to the user’s interactions.

Creating Our First Custom Component:
```
    Vue.component('OurHeader', {
      template: ` <h1>App Header</h1> `
      }
    );
```

Using Our First Custom Component:
```
    <our-header></our-header>
    <OurHeader></OurHeader>
```

## Using Data

Since a component is an instance of Vue, we can specify data that it contains. Note that with components, data is defined as a function that returns an object instead of as an object. This is so that each instance of the component will have its own copy of the data, isolating it from the changes in instances of the component.

Defining component data:
```
    Vue.component('OurSecondHeader', {
      data: function() {
        return {
          text: 'App Header 2'
        };
      },
      template: `
        <h1 v-on:click="text = text.split(").reverse().join(")">{{text}}</h1>
      `
    });
```

## Passing Data with Props

With props, we can specify values that can be passed to the component from the parent component. Declaring props on a component using the props option and assign it an array of strings for the names of props to use:

```
    Vue.component('OurThirdHeader', {
      props: ['text'],
      template: `
        <h1>{{text}}</h1>
      `
    });
```

When we use our component, we can pass in the text to display in our component. This example shows a static assignment to the text prop. Static in this case means that the value is a literal string that is declared in the markup.

```
    <OurThirdHeader text="App Header 3" />
```

Rather than pass a static value to the text prop, we can bind to a value in the parent component. This example shows how to bind the value of appLabel from the parent component to the text prop with v-bind.

Binding data to the text prop:
```
    var app = new Vue({
      el: '#app',
      data: {
        appLabel: 'App'
      },
      template: `
        <div> <OurThirdHeader v-bind:text="appLabel" /> </div>
      `
    });
```

Props also allows us to specify types and default values, determine whether they are required, and use validators. At a minimum, it is a good idea to specify a type. This can be done by assigning an object instead of an array to the props property. Each property of this object will be the name of a prop and the value will be the type that it supports.

Specifying a Type for a Prop:
```
    Vue.component('OurFourthHeader', {
      props: {
        text: String
      },
      template: `
        <h1>{{text}}</h1>
      `
    });
```
Acceptable types to use when specifying the props type are the standard JavaScript object types: String, Number, Boolean, Array Object.

To use the other options with a prop, we have to change it so that instead of a type, we specify an object as its value. We then can use the property names of this object to specify the type, default value, required or not, and the validator. The following example shows our text prop with a type of String, a default of App Header 5, required set to false, and a validator that checks in the text for the word app.

Specifying a props type, default, required, and validator:
```
Vue.component('OurFifthHeader', {

props: { text: { type: String, default: 'App Header 5', required: false, validator: function(value) { return value.toLowerCase().indexOf('app') > -1; }

} }, template: ` <h1>{{text}}</h1> ` });
```



Verdergaan op p157
