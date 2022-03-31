package app.onlinecompiler.misc;

import app.onlinecompiler.model.SavedCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedCodeRepository extends JpaRepository<SavedCode, Integer> {

    Optional<SavedCode> findByCodeTag(String codeTag);

}
