package io.orbit.partner.data.local

import android.content.Context
import androidx.room.*
import io.orbit.partner.domain.model.PendingAction
import kotlinx.coroutines.flow.Flow

@Dao
interface PendingActionDao {

    @Query("SELECT * FROM pending_actions ORDER BY createdAt ASC")
    fun getAllPendingActionsFlow(): Flow<List<PendingAction>>

    @Query("SELECT * FROM pending_actions ORDER BY createdAt ASC")
    suspend fun getAllPendingActions(): List<PendingAction>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAction(action: PendingAction)

    @Delete
    suspend fun deleteAction(action: PendingAction)
}

@Database(entities = [PendingAction::class], version = 1, exportSchema = false)
abstract class OrbitPartnerDatabase : RoomDatabase() {

    abstract fun pendingActionDao(): PendingActionDao

    companion object {
        @Volatile
        private var INSTANCE: OrbitPartnerDatabase? = null

        fun getDatabase(context: Context): OrbitPartnerDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    OrbitPartnerDatabase::class.java,
                    "orbit_partner_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
