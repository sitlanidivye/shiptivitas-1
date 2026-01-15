import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    const clients = this.getClients();

    this.state = {
      clients: {
        backlog: clients.filter(c => !c.status || c.status === 'backlog'),
        inProgress: clients.filter(c => c.status === 'in-progress'),
        complete: clients.filter(c => c.status === 'complete'),
      }
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(c => ({
      id: c[0],
      name: c[1],
      description: c[2],
      status: c[3],
    }));
  }

  componentDidMount() {
    const drake = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current
    ]);

    drake.on('drop', (el, target) => {
      const clientId = el.getAttribute('data-id');
      const newStatus = target.getAttribute('data-status');

      this.setState(prev => {
        // Remove from all lanes
        const updated = { ...prev.clients };
        Object.keys(updated).forEach(k => {
          updated[k] = updated[k].filter(c => c.id !== clientId);
        });

        // Add to new lane
        const movedClient = Object.values(prev.clients).flat().find(c => c.id === clientId);
        movedClient.status = newStatus;

        if (newStatus === 'backlog') updated.backlog.push(movedClient);
        if (newStatus === 'in-progress') updated.inProgress.push(movedClient);
        if (newStatus === 'complete') updated.complete.push(movedClient);

        return { clients: updated };
      });
    });
  }

  renderSwimlane(title, clients, ref, status) {
    return (
      <div className="Swimlane-column" ref={ref} data-status={status} style={{ minHeight: '400px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>{title}</h3>
        {clients.map(c => (
          <div 
            key={c.id} 
            data-id={c.id} 
            style={{
              padding: '8px',
              margin: '5px 0',
              backgroundColor: 
                c.status === 'backlog' ? 'lightgrey' : 
                c.status === 'in-progress' ? 'lightblue' : 'lightgreen',
              borderRadius: '5px',
              cursor: 'move'
            }}
          >
            <strong>{c.name}</strong>
            <div>{c.description}</div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="Board" style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
        {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog, 'backlog')}
        {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress, 'in-progress')}
        {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete, 'complete')}
      </div>
    );
  }
}
