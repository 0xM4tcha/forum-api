/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp')
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
