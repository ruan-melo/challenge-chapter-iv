import {IsNull, MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatementsAddTypeTransfer1648504281638 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn('statements', 'type', new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['transfer', 'deposit', 'withdraw']
      }));

      await queryRunner.addColumn('statements', new TableColumn({
        name: 'sender_id',
        type: 'uuid',
        isNullable: true,

      }))

      const foreignKey =  new TableForeignKey({
        name: 'FKSenderStatement',
        columnNames: ['sender_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: "SET NULL",
        deferrable: 'DEFERRABLE'
      });


      await queryRunner.createForeignKey('statements', foreignKey)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('statements', 'FKSenderStatement');
      await queryRunner.dropColumn('statements', 'sender_id');
      await queryRunner.changeColumn('statements', 'type', new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw']
      }));
    }

}
