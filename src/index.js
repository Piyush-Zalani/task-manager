import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

export default class AppDragDropDemo extends Component {
  state = {
    tasks: [],
    categories: {}
  };

  onDragStart = (ev, id) => {
    ev.dataTransfer.setData("id", id);
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDrop = (ev, cat) => {
    let id = ev.dataTransfer.getData("id");

    const tasks = this.state.tasks.filter(task => {
      if (task.name === id) {
        task.category = cat;
      }
      return task;
    });
    this.manageTask(tasks);
  };

  manageTask = tasks => {
    const { categories } = this.state;
    const catalog = {};
    Object.keys(categories).map(category => {
      catalog[category] = [];
    });
    tasks.map(t => {
      return catalog[t.category].push(
        <div
          key={t.name}
          onDragStart={e => this.onDragStart(e, t.name)}
          draggable
          className="draggable"
          style={{ backgroundColor: t.bgcolor }}
        >
          {t.name}
        </div>
      );
    });

    this.setState({
      categories: catalog,
      tasks
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { target } = e;
    const name = target[0].value;
    const category = target[1].value;
    if (this.state.tasks.filter(task => task.name === name).length > 0) {
      return console.log("Task already exists");
    }
    const tasks = [...this.state.tasks, { name, category, bgcolor: "skyblue" }];
    this.manageTask(tasks);
  };

  addCategories = e => {
    e.preventDefault();
    const catagory = e.target[0].value;
    const { categories: catagories } = this.state;
    if (catagory in catagories) {
      return console.log("List already exists");
    }
    const categories = { ...catagories, [catagory]: [] };
    this.setState({ categories });
  };

  render() {
    const { categories } = this.state;

    return (
      <div>
        {Object.keys(categories).length > 0 && (
          <form onSubmit={this.onSubmit}>
            <input type="text" />
            <select>
              {Object.keys(categories).map(category => {
                return (
                  <option value={category} key={category}>
                    {category}
                  </option>
                );
              })}
            </select>
            <button type="submit"> Add </button>
          </form>
        )}
        <form onSubmit={this.addCategories}>
          <input type="text" />
          <button type="submit"> Add Categories </button>
        </form>
        <div className="container-drag">
          {Object.keys(categories).map(category => (
            <div
              className={`pending ${category}`}
              onDragOver={e => this.onDragOver(e)}
              key={category}
              onDrop={e => {
                this.onDrop(e, category);
              }}
            >
              <span className="task-header">{category}</span>
              {categories[category]}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<AppDragDropDemo />, document.getElementById("root"));
