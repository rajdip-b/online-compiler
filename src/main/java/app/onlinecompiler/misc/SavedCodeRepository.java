package app.onlinecompiler.misc;

import app.onlinecompiler.model.SavedCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedCodeRepository extends JpaRepository<SavedCode, Integer> {

    Optional<SavedCode> findByCodeTag(String codeTag);

    @Query(
            nativeQuery = true,
            value = "SELECT * FROM saved_code AS s WHERE (s.code_language LIKE %:query% OR s.code_title LIKE %:query% OR s.author LIKE %:query% OR s.code_description LIKE %:query%) AND s.code_type='COMMUNITY'",
            countQuery = "SELECT count(*) FROM saved_code AS s WHERE (s.code_language LIKE %:query% OR s.code_title LIKE %:query% OR s.author LIKE %:query% OR s.code_description LIKE %:query%) AND s.code_type='COMMUNITY'"
    )
    Page<SavedCode> searchCommunityCodes(Pageable pageable, @Param("query") String query);

}
