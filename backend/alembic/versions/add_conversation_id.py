from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('chat_history', sa.Column('conversation_id', sa.String(), nullable=True))
    op.create_index(op.f('ix_chat_history_conversation_id'), 'chat_history', ['conversation_id'])

def downgrade():
    op.drop_index(op.f('ix_chat_history_conversation_id'), table_name='chat_history')
    op.drop_column('chat_history', 'conversation_id')
